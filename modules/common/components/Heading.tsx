import classNames from 'classnames';
import { designTokens } from '../constants/designTokens';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const Heading = ({ level = 1, children, className = '' }: HeadingProps) => {
  const Tag = `h${level}` as const;
  const levelKey = `h${level}` as keyof typeof designTokens.typography.heading;

  return (
    <Tag className={classNames(designTokens.typography.heading[levelKey], className)}>
      {children}
    </Tag>
  );
};

export default Heading;
