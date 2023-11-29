import { cn } from "../../lib/utils";

type PlayerIframeProps = React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;

export default function PlayerIframe({ className, ...other }: PlayerIframeProps) {

  return (
    <iframe
      className={cn("rounded", className)}
      loading="lazy"
      allowFullScreen={true}
      {...other}
    />
  );
}