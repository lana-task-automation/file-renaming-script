# File Renaming Script

Rename files in batch using regex, require nodejs 14+

## Usage

Rename all file contains hello to hi in specific folder

```shell
$ node renamer.cjs.js --dir=/path/to/dir --match=hello --rename=hi
```

Revert last change

```shell
$ node renamer.cjs.js revert
```

Show help

```shell
$ node renamer.cjs.js -h
renamer.cjs.js rename

Batch rename files

Commands:
  renamer.cjs.js rename  Batch rename files                                  [default]
  renamer.cjs.js revert  Revert renamed files

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -m, --match                                                         [required]
  -r, --rename                                               [string] [required]
  -d, --dir                                              [string] [default: "."]
      --regex                                         [boolean] [default: false]
      --multi                                         [boolean] [default: false]
      --log                                            [boolean] [default: true]
```
