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
