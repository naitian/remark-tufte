# remark-tufte

> WIP: dirty code, no tests, use at your own risk!

I wrote this because [`tufte-markdown`](https://github.com/luhmann/tufte-markdown)
doesn't work with the newest versions of
[`remark`](https://github.com/remarkjs/remark) (as far as I could tell). This also
fixes a couple of the bugs with `tufte-markdown`.

See `examples/index.js` for how to use this package (which is really a
collection of plugins right now).

Almost all features of tufte-css are supported.

Still to do:
- [ ] Write wrapper plugin that runs all the individual plugins in the correct
  order
- [ ] Resolve references inside sidenotes
- [ ] Better citation system (possibly out of scope of this project...)
