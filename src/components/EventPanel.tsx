import { EventCard } from '../types/game';
import Panel from './Panel';

interface EventPanelProps {
  eventCard: EventCard;
  onResolve: () => void;
}

const EventPanel = ({ eventCard, onResolve }: EventPanelProps) => {
  return (
    <Panel title={`旅行事件：${eventCard.title}`} subtitle={eventCard.polarity === 'positive' ? '正面事件' : '負面事件'}>
      <p className="text-sm text-slate-200">{eventCard.description}</p>
      <button className="btn-primary mt-4" onClick={onResolve}>
        面對事件
      </button>
    </Panel>
  );
};

export default EventPanel;
