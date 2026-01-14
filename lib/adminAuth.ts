/**
 * Admin Authentication Utilities
 * Validates CMS access using Unchained Engine's auth system
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { hasCMSAccess, hasPermission, CMSPermission } from "./cms.config";

// Development mode bypass - allows CMS access without authentication
// Set CMS_DEV_MODE=true in .env.local to enable
const isDevelopment = process.env.NODE_ENV === "development";
const devModeEnabled = process.env.CMS_DEV_MODE === "true";

// Mock user for development mode
const DEV_USER: CMSUser = {
  _id: "dev-user",
  name: "Development User",
  username: "dev",
  roles: ["admin"],
  isGuest: false,
};

// Minimal user query - just what we need for auth
const USER_AUTH_QUERY = `
  query UserAuth {
    me {
      _id
      name
      username
      roles
      isGuest
    }
  }
`;

export interface CMSUser {
  _id: string;
  name: string;
  username: string;
  roles: string[];
  isGuest: boolean;
}

export interface AuthResult {
  authorized: boolean;
  user?: CMSUser;
  error?: string;
  redirect?: string;
}

/**
 * Fetch the current user from Unchained Engine
 * Forwards cookies from the incoming request
 */
export async function getUnchainedUser(
  req: NextApiRequest,
): Promise<CMSUser | null> {
  const unchainedEndpoint = process.env.UNCHAINED_ENDPOINT;

  if (!unchainedEndpoint) {
    console.error("UNCHAINED_ENDPOINT not configured");
    return null;
  }

  try {
    const response = await fetch(unchainedEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies from the incoming request
        Cookie: req.headers.cookie || "",
      },
      body: JSON.stringify({
        query: USER_AUTH_QUERY,
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch user from Unchained:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.data?.me || null;
  } catch (error) {
    console.error("Error fetching user from Unchained:", error);
    return null;
  }
}

/**
 * Check if the current request has CMS access
 * Returns authorization result with user info
 */
export async function requireCMSAccess(
  req: NextApiRequest,
): Promise<AuthResult> {
  // Development mode bypass
  if (isDevelopment && devModeEnabled) {
    console.log("[CMS Auth] Development mode - bypassing authentication");
    return {
      authorized: true,
      user: DEV_USER,
    };
  }

  const user = await getUnchainedUser(req);

  if (!user) {
    return {
      authorized: false,
      redirect: "/login",
      error: "Not authenticated",
    };
  }

  if (user.isGuest) {
    return {
      authorized: false,
      redirect: "/login",
      error: "Guest users cannot access CMS",
    };
  }

  const userRoles = user.roles || [];
  if (!hasCMSAccess(userRoles)) {
    return {
      authorized: false,
      error: "Insufficient permissions - CMS access required",
    };
  }

  return {
    authorized: true,
    user,
  };
}

/**
 * Check if the current request has a specific CMS permission
 */
export async function requirePermission(
  req: NextApiRequest,
  permission: CMSPermission,
): Promise<AuthResult> {
  const authResult = await requireCMSAccess(req);

  if (!authResult.authorized) {
    return authResult;
  }

  const userRoles = authResult.user?.roles || [];
  if (!hasPermission(userRoles, permission)) {
    return {
      authorized: false,
      user: authResult.user,
      error: `Permission denied: ${permission}`,
    };
  }

  return authResult;
}

/**
 * Middleware helper for API routes
 * Returns true if authorized, sends error response if not
 */
export async function withCMSAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  permission?: CMSPermission,
): Promise<{ authorized: boolean; user?: CMSUser }> {
  const authResult = permission
    ? await requirePermission(req, permission)
    : await requireCMSAccess(req);

  if (!authResult.authorized) {
    if (authResult.redirect) {
      res.status(401).json({
        error: authResult.error,
        redirect: authResult.redirect,
      });
    } else {
      res.status(403).json({ error: authResult.error });
    }
    return { authorized: false };
  }

  return { authorized: true, user: authResult.user };
}
