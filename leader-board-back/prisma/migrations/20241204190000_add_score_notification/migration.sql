-- Create notification function for team score changes
CREATE OR REPLACE FUNCTION notify_team_score_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if score actually changed
  IF OLD.score IS DISTINCT FROM NEW.score THEN
    PERFORM pg_notify('team_score_updates', json_build_object(
      'team_id', NEW.id,
      'name', NEW.name,
      'old_score', OLD.score,
      'new_score', NEW.score,
      'updated_at', NEW."updatedAt"
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS team_score_change_trigger ON "Team";

-- Create trigger on Team table
CREATE TRIGGER team_score_change_trigger
AFTER UPDATE ON "Team"
FOR EACH ROW
EXECUTE FUNCTION notify_team_score_change();
