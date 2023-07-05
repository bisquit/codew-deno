## develop

```sh
deno task dev .
```

### Add npm dependencies

```sh
deno task esm:add react
```

### Testing

```sh
deno task test --watch
```

## publish

```sh
deno task compile
```

```sh
# replace version
tar -czf codew-0.0.1-x86_64-apple-darwin.tar.gz .bin/codew
```

Create GitHub release and upload tarball.

Then, update formula.
https://github.com/bisquit/homebrew-tap/blob/main/Formula/codew.rb
