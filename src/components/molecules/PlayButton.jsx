import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";

const PlayButton = ({ isPlaying, onClick }) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      aria-label={isPlaying ? "Pause forecast" : "Play forecast"}
      aria-pressed={isPlaying}
    >
      <Icon name={isPlaying ? "pause" : "play"} size={14} />
    </Button>
  );
};

export { PlayButton };
