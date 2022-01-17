require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-izooto"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = "iZooto Push Notificition Services"
  s.homepage     = "https://github.com/github_account/react-native-izooto"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Amit Kumar Gupta" => "amit@datability.co" }
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-izooto.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true
  s.dependency "iZootoiOSSDK"

  s.dependency "React"
  # ...
  # s.dependency "..."
end

