-- Add rising_founder to article_type enum
ALTER TYPE public.article_type ADD VALUE IF NOT EXISTS 'rising_founder';