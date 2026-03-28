source "https://rubygems.org"

# 使用 GitHub Pages  gem，它会自动包含所有 GitHub Pages 支持的插件
gem "github-pages", group: :jekyll_plugins

# 如果需要特定版本的 Jekyll，可以取消下面的注释
# gem "jekyll", "~> 3.9.0"

# GitHub Pages 兼容的插件
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
end

# Windows 和 JRuby 依赖
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# 性能优化
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# 锁定 webrick 版本（Ruby 3.0+ 需要）
gem "webrick", "~> 1.7"