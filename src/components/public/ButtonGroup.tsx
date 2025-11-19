// src/components/public/ButtonGroup.tsx

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
    <div className="space-y-3 mb-8 w-full max-w-md mx-auto">
      {buttons.map((button) => (
        <a
          key={button.id}
          href={`/api/links/${button.id}/click`}
          className="block w-full rounded-lg border-2 border-black px-6 py-4 text-center font-medium hover:bg-black hover:text-white transition-colors"
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
    </div>
  );
}

