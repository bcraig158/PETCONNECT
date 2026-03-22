type Button = {
  id: string;
  title: string;
  url: string;
  clicks: number;
};

type Props = {
  buttons: Button[];
  theme?: {
    primary?: string;
    bg?: string;
    text?: string;
  };
};

export default function ButtonGroup({ buttons, theme }: Props) {
  if (buttons.length === 0) return null;

  return (
    <nav className="space-y-3 mb-8 w-full max-w-md mx-auto" aria-label="Profile links">
      {buttons.map((button) => (
        <a
          key={button.id}
          href={`/api/links/${button.id}/click`}
          className="block w-full rounded-lg border-2 border-black px-6 py-4 text-center font-medium hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          style={
            theme?.primary
              ? {
                  borderColor: theme.primary,
                  color: theme.primary,
                }
              : undefined
          }
        >
          {button.title}
        </a>
      ))}
    </nav>
  );
}
