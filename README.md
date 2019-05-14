# Gammadic Text Editor

Enables you to write files in the Gammadic alphabet.

## Usage

```bash
git clone https://github.com/kylejlin/gammadic-editor.git;
cd gammadic-editor;
docker build -t gammadic-editor .;
docker run -p 8080:8080 gammadic-editor;
```

Then

- Open up http://localhost:8080 in your browser.
- In the top text input, set the path to `/app/sample.txt`.
- Type away!
- Press `ctrl+s` to save file.

### Stopping the container

To stop, do the following:

First, run

```bash
docker container ls
```

This will print a table. Look for the row where IMAGE==gammadic-editor. Then run

```bash
docker container rm [NAME]
```

where `[NAME]` is the NAME column of the above row.

### Advanced usage

If you want to edit files on your own machine, instead of the Docker container, you can try running

```bash
npm start
```

It will take a minute or two. Once it says `Listening on port 8080`, the editor is running.

Try this at your own risk.

## Copyright

Copyright (c) Kyle Lin 2019
