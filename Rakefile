require 'juicer'

minifier = "closure_compiler"

file "colorstrip.min.js" => ["colorstrip.js"] do |t|
  Juicer::Cli.run ["merge", t.prerequisites.join(" "), "-o", t.name, "-s", "-m", minifier, "-f"]
end

task :setup do
  Juicer::Cli.run ["install", minifier, "-v", "latest"]
end

task :default => "colorstrip.min.js"