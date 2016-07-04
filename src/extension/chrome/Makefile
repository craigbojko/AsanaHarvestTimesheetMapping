.PHONY: bootstrap test start build;

BIN = ./node_modules/.bin

bootstrap:
	@npm install

build:
	@webpack

watch:
	@webpack --watch

test:
	@$(BIN)/standard
	@./node_modules/karma/bin/karma start --single-run=true