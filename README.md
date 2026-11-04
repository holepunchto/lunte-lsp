# lunte-lsp

Language Server Protocol wrapper for Lunte.

## Installation

```sh
npm install --save-dev lunte lunte-lsp
```

## Usage

```sh
lunte-lsp
```

The server reuses Lunte's analyzer, reads `.lunterc` / `.lunterc.json`, and streams diagnostics over stdio.

## Neovim

```lua
vim.lsp.config['lunte'] = {
  cmd = { 'npx', 'lunte-lsp' },
  filetypes = { 'javascript' },
  root_markers = { '.lunterc', '.lunterc.json' },
  single_file_support = true,
}

vim.lsp.enable('lunte')
```

## Helix

Install the server in your project (see [Installation](#installation)), then
define a `lunte` language server and add it to JavaScript in either your user
config (`~/.config/helix/languages.toml`) or a project-local
`.helix/languages.toml`:

```toml
[language-server.lunte]
command = "npx"
args = ["lunte-lsp"]

[[language]]
name = "javascript"
language-servers = ["typescript-language-server", "lunte"]
```

`npx lunte-lsp` resolves the project-local install from the workspace's
`node_modules`. If you installed `lunte-lsp` globally instead
(`npm install --global lunte lunte-lsp`), use `command = "lunte-lsp"` and
`args = []`.

Setting `language-servers` replaces Helix's default list for the language, so
keep `typescript-language-server` in it to retain completion, hover,
go-to-definition and its own diagnostics. Lunte supplements those diagnostics
with its lint results; it does not replace TypeScript's semantic or
type-checking diagnostics, so there is no need to disable them. Helix must be
able to find `typescript-language-server` on your `PATH` (for example via
`npm install --global typescript typescript-language-server`); drop it from the
list if you only want Lunte.

Run `hx --health javascript` to check that both servers are detected.

## Testing

```sh
npm install
npm test
npm run test:package
```

The package test installs the server tarball into a clean temporary consumer and
runs the Node/Bare protocol suites against it. It uses published `lunte` by default;
set `LUNTE_TARBALL=/absolute/path/to/lunte.tgz` to override that dependency with a
local core tarball. `LUNTE_LSP_BIN` can target an already-installed server directly.

## Repository

https://github.com/holepunchto/lunte-lsp

## License

Apache-2.0
