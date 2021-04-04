# ArcticLight's Portfolio

This is a selection of three small projects that are my own
personal work I've done in my spare time. I would consider these to be
merely a **small sample** of my skillset and programming ability. Do reach
out to me directly with any questions or comments, I can be found at
[`arcticlight@arcticlight.me`](mailto:arcticlight@arcticlight.me); please
use the subject "`gb: portfolio`" to ensure a more prompt response time.

This folder is standalone/modern ECMAScript 2020. It can
be run unmodified in most [Evergreen browsers](https://www.techopedia.com/definition/31094/evergreen-browser)
without any tooling in the way. You would do this by hosting _this folder_
with a web-server and viewing it. You could, for example, use `python3 -m http.server`
or your favorite simple static solution.

This folder is itself one of the tech-demos. It is _backend-less_ and does not require an API
to operate. It can be statically hosted anywhere, and the work is done entirely in the
browser, showcasing modern ESM/client-side rendering capabilities. It's been tested in Chrome
and in Firefox, and should work in pretty much anything implementing a fairly current
(<2y old) JavaScript engine with support for modules.

> There is a bug in one, specific, old version of Safari that prevents this from working.
> If you're using Safari and it's broken, update to a newer Safari.

For your convenience, the top-level-directory is also a functioning Node.JS
server on Express which serves the demo. If you have Node.JS installed, you can
`npm i && npm start` within this directory to start the default server on port `3000`.
The Node server is provided as a convenience, and does not run a "true" backend service or
API.

> ### If it's static, why does the folder have to be served? Couldn't I just open the index.html file?
> Browsers by default block a local html file from loading Javascript and other resources
> by reference. In order to demonstrate that the project is self-contained and doesn't perform
> any trickery, all the project files are local. This restriction is not applicable to files
> hosted over HTTP (even via localhost)


> ### This demo is mostly JavaScript. Why would I let you near another programming language?
> I happen to _like_ JavaScript as a demo and prototyping language. It's what I use in my
> spare time, but I'm also quite proficient and can be useful in many, many other languages 
> and environments as well.
>
> I'd encourage you to [look over my Resume](https://arcticlight.me/resume/) where
> I have held down jobs using a range of tools, toolchains, and even disciplines covering
> backend and frontend.
> Unfortunately, much of my professional work in other languages is proprietary and I can't
> readily share code samples of that work. I would happily discuss these to the best of my
> ability during an engineering interview.
>
> If you really _must_ see a code sample in the language of your choosing, I am willing to
> perform a basic coding test in that language that takes no longer than 1 hour.
> **I would very much prefer _not_ to do this** if at all possible. I hope that I can
> convince you with this portfolio that I know how to code and have mastery over complex
> tasks such as advanced functional programming, and the ability to learn and apply new
> skills, and the ability to use whatever is necessary to finish a task as
> it becomes available or relevant to my job.

<br>
<br>

## The Demos
There are three demos in this portfolio, highlighting different technical abilities.
Unfortunately, I spend most of my professional time working on proprietary code whose
sources can't be shared directly, so this portfolio can't share direct source code
covering all of my skills. The demos are best understood to be the highest quality of work
that I can output in my spare time, as hobby projects.


### Demo 1: JSTween
A project I started back in college, which was [originally written in Scala](https://github.com/arcticlight/scalatween)
and then ported [to JavaScript](https://github.com/arcticlight/jstween). I've been maintaining
this project for myself for a long time and have kept it up-to-date with modern browsers and
TypeScript. It meets my needs for several personal and volunteer projects that I've worked on.

I've managed to build some tech-demos, as well as some presentations and proofs-of-concept,
all leveraging this library at the core.

#### Has it been battle-tested?
Somewhat. I use this animations library to power a few small projects. It's probably
not "production-grade" and it is no substitute for a library like Greensock, but it does have
a lot of its kinks and bugs ironed out by some regular use on my part. The code should be
high-quality and relatively bug-free.

#### What it is:
JSTween implements a hybrid OO/Functional API for describing animations, in a way that is more intuitive for someone with
a handle on Tween-based animation (think: Adobe Animate, formerly Flash). Animations are
described in terms of `Tweens` affecting `AnimationTargets` over time, where long sequences
either occur in parallel (`ParTimeline`) or sequentially (`SeqTimeline`) and resulting
in concise code such as:
```js
/**
 * the signature of to() is:
 * to(target, fromValue, toValue, durationInSeconds = 1): Tween
 */
const animation1 = seqTimeline(
  parTimeline(
    to(opacity, 0, 1, .4),
    to(xPos, -100, 400, .4),
  ).withEase(Eases.easeInOutQuad),
  parTimeline(
    to(rotate, 0, 360),
    to(scale, 1, 0),
  ),
);
```

Animations can then be composed together beautifully as well. For example, you can then
include `animation1` within another animation or timeline, because they nest. You can also
apply functions (the most common case being easing curves) that affect the composition of
a timeline or individual Tween.

#### What it can be:

An additional feature that could be built on top of this approach (but has not yet been
implemented) is that because all timelines and animations are themselves Tweens (in the
case of timelines, a timeline is a Tween composed with more Tweens) and all Tweens describe
the exact state of an animation for any given point in time, you can then power physics
and calculus-based animation results.

For example, one common problem in animation is blending two unrelated animations that
must overlap. A naive approach would be to slowly interpolate both running animations,
"fading" between one another. However, this approach violates one of the most important
properties in animation: there's a visual "hitch" at both sides of the interpolation, as
the animation's _acceleration_ jerks on both sides. The _position_ would average out smoothly
over time, but the animation's _acceleration_ would suddenly change.

Visually, the sudden change in acceleration is quite jarring and stands out to the eye as an
animation error. Solving this problem in a way that removes the visual glitch can be done in a
number of ways, but in my opinion the most elegant is by taking the derivative of the
animation (animation being a function of _position_ over time) to achieve a function of its
_velocity_ over time, and to interpolate these velocity curves (and not interpolating their
direct positions) instead.

### Demo 2: stdFilters

This module implements a (relatively) typesafe construction of a GraphQL filtering
input-type, and _also_ its filter implementation, a function which takes in the lists
and the input-type and performs the filtering. This example highlights complex higher-kinded
types and a mastery over the TypeScript typesystem, among other notable Functional Programming
concepts.

#### Has it been battle-tested?
Only mildly. I've used it exactly once, in one recent personal project. I believe it to
meet my needs and that it does not error in the scenario I'm using it for, but cannot
confirm that it is completely bug-free at this time. Any questions about this code
can be directed to [my email](mailto:arcticlight@arcticlight.me).

#### What it is:
I've recently been having a fun time drafting a few toy projects in [Gatsbyjs](https://www.gatsbyjs.com).
One of the things I really like about it his how blazingly-fast the resulting website
is, and also how simple and joyously uncomplicated it is to introduce data-driven
pages. One of its very best features is the ability to infer, from a dataset, a
GraphQL API that queries the dataset &mdash; and this includes as standard the ability to
sort and filter the data.

My project is currently growing to need more than Gatsby can offer, and I've
begun the process of handwriting a similar, replacement GraphQL API for it. However,
I really wanted to keep the Gatsby-style filtering in place. My needs were small enough
that I chose to implement the construction of the filtering types and schema myself,
since I felt confident that the problem was small and tractable. The result is `stdFilters.js`.

#### What it can be:
`stdFilters.js` could easily be extended to include more complex filtering operations,
and also to construct standard sorting procedures as well. GatsbyJS has already demonstrated
that the mechanical construction of such an API can work, it's just a matter of implementation.

I do not currently foresee a need for me to extend stdFilters with anything more than it
already has, notably `eq, in, nin` operations which is what I needed for my project, so it's
unlikely that I will take on the task of extending it unless one of my projects calls for it.

### Demo 3: Dotfriles
I wanted to include at least one demo that demonstrates the ability to program in something
other than JavaScript, and demonstrated more broad technical skill than just Web. Unfortunately
I spend much of my spare time on Web-based projects in JS (because it's easy and I can draft
code much faster). Even though I can work with a large variety of programming languages, I
don't have a lot of code in them that I can share because:
1. Much of the work that I _can_ share is ancient (and therefore not representative of my
   present skillset), and
2. The work that is representative of my current skills is proprietary or job-related and
   _can't_ be shared.

#### Has it been battle-tested?

`Dotfriles` continues to work for me on my systems across all debian-based derivatives I've
tried. I've used it to configure almost every server and coding environment I've come across,
quite successfully. I can't promise it will meet anyone else's needs, but I've been using
it across Ubuntu Desktop, Linux Mint, Raspbian, Ubuntu Server, and Debian for a long time. It
meets my needs, works quickly and quietly, and I can go get a cup of coffee confident that when
I return, my terminal will look exactly the same on the new system as it does on all my other
machines.

#### What it is:

`Dotfriles` is a drop-dead-simple dotfiles manager I started when I was in college, and have
kept working (at least for myself) ever since.

Because I provision new development environments
often &mdash; usually because I've exploded my last environment with an experiment or two, and
need to wipe it clean &mdash; I needed something that could bundle my customizations and
preferences and get the new system working the way I like it with the minimum effort.

Dotfriles
downloads my [dotfiles repository](https://github.com/arcticlight/my-dotfiles) and symlinks
everything inside into my home folder. It also has the auxiliary function of running an
`apt-get update && apt-get upgrade -y` beforehand, and doing
`apt-get install git tmux zsh vim` which are the single-most-used tools for me, that are
sometimes not all installed on a system by default.

#### What it can be:
Originally `Dotfriles` was a sort of class-project. Our professor had told us to try to use
a dotfile-manager, and many of the managers I'd looked at (in 2014!) did much, much more
than I needed them to do. Some even had complicated install procedures that required time and
effort on the host machine. I built `Dotfriles` in bash so that it didn't _have_ to be installed,
and I wanted it to do exactly one thing for me: set up a new dev environment with my dotfiles in
5 minutes or less, hands-off-keyboard.

`Dotfriles` already does this, and I feel like it can't and shouldn't be extended in any way.
There are other projects that implement dotfile managers, and at this point in 2020 there are
alternatives that are much more robust than my janky Bash script. I keep it around for my own
use, but I would imagine that if I ever decided that `Dotfriles` should do more, that I should
instead invest in changing over my dotfile management to one of those better projects that
already exist, instead of trying to build and maintain my own.
