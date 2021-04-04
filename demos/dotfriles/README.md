# Dotfriles

`Dotfriles` is the _very creative_ name of a dotfile manager I wrote and maintain myself,
([sources are available here](https://github.com/arcticlight/dotfriles))
primarily for my own home use. I use it to quickly provision Ubuntu-derivative development
environments with [my dotfiles](https://github.com/arcticlight/my-dotfiles).

I literally can't count how much time this tiny bash-script has saved me over the years.
It's very handy to have my dotfiles maintained in a Git repository, and being able to
start with a clean Ubuntu (or Raspbian, or server, or Linux Mint, etc) and walk away while
everything is set up.

When I come back, everything being the way that I like it is so important. The tiny
tweaks and customizations carry over from one environment to the next; it makes every
environment feel like an old friend.

While the script itself is not terribly interesting, it does serve as a nice conversation
starter regarding my experiences with Linux system administration, and managing and
working with my own development environments. I keep a home computer lab (which I use
to hack on and in), and I also use `Dotfriles` to quickly get new servers up and running,
when I provision those (my favorite cloud environment being
[DigitalOcean](https://digitalocean.com), for literally no other reason than I like the
predictable pricing).

Maybe someday I'll actually figure out how to use `Cloud-Init` and replace Dotfriles with
a userdata file, but I haven't really had the need to do so at present.
