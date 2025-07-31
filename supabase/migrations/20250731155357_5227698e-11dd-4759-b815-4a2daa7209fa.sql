-- Add case_id columns to reports and chat_sessions tables
-- This will allow linking reports and chats with a unique case identifier

-- First, add case_id to reports table
ALTER TABLE public.reports 
ADD COLUMN case_id TEXT UNIQUE;

-- Add case_id to chat_sessions table  
ALTER TABLE public.chat_sessions
ADD COLUMN case_id TEXT;

-- Create index for faster lookups
CREATE INDEX idx_reports_case_id ON public.reports(case_id);
CREATE INDEX idx_chat_sessions_case_id ON public.chat_sessions(case_id);

-- Create function to generate unique case IDs
CREATE OR REPLACE FUNCTION generate_case_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        -- Generate a random 6-digit case ID
        new_id := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        
        -- Check if it already exists in reports
        IF NOT EXISTS (SELECT 1 FROM public.reports WHERE case_id = new_id) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Unable to generate unique case ID after 100 attempts';
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-generate case_id for reports
CREATE OR REPLACE FUNCTION set_case_id_for_report()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.case_id IS NULL THEN
        NEW.case_id := generate_case_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_case_id_for_report
    BEFORE INSERT ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION set_case_id_for_report();