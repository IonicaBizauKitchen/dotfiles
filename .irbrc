# Don't clutter the prompt
IRB.conf[:PROMPT_MODE] = :SIMPLE

# Try to load awesome_print, but fail gracefully
begin
  require 'awesome_print'
  AwesomePrint.irb!
rescue LoadError => err
  warn "Couldn't load awesome_print: #{err}"
end

# Supresss SQL query in the Rails console
if defined? Rails
  ActiveRecord::Base.logger.level = 1
end
