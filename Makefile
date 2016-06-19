.PHONY: bootstrap test start build watch;

BIN = ./node_modules/.bin

start:
	@npm start

listen:
	@grunt watch-server

debug:
	@npm start-debug

bootstrap:
	@npm install

build:
	@webpack

watch:
	@webpack --watch

test:
	@$(BIN)/standard
	@./node_modules/karma/bin/karma start --single-run=true