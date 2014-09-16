class UnicodeHelper
  #example_text = "So nice !!!!<U+1F60D><U+1F49D>"

  # change formatting from "<U+1F60D>" to "\u{1F60D}"
  def self.to_unicode(str)
    str.match /<U\+([\w+-]+)>/
    [$1.to_i(16)].pack("U*")
  end
end
