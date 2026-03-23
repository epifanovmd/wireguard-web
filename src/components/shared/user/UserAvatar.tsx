import { cva, VariantProps } from "class-variance-authority";
import { FC } from "react";

const COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-orange-500",
];

function colorFromString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return COLORS[Math.abs(h) % COLORS.length];
}

const avatarVariants = cva(
  "rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
  {
    variants: {
      size: {
        sm: "w-7 h-7 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type UserAvatarProps = { name: string } & VariantProps<typeof avatarVariants>;

export const UserAvatar: FC<UserAvatarProps> = ({
  name,
  size = "md",
}) => {
  const initials =
    name
      .split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className={avatarVariants({ size, className: colorFromString(name) })}>
      {initials}
    </div>
  );
};
