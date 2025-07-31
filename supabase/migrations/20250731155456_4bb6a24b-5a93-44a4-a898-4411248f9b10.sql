-- Fix function search path security warnings
-- First drop the trigger, then recreate functions with proper search_path

DROP TRIGGER IF EXISTS trigger_set_case_id_for_report ON public.reports;

DROP FUNCTION IF EXISTS public.set_case_id_for_report();
CREATE OR REPLACE FUNCTION public.set_case_id_for_report()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.case_id IS NULL THEN
        NEW.case_id := public.generate_case_id();
    END IF;
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.generate_case_id();
CREATE OR REPLACE FUNCTION public.generate_case_id()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_set_case_id_for_report
    BEFORE INSERT ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_case_id_for_report();