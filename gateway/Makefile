default: build

# Default target to build the image
build:
	docker build -t homecontroller-gateway .

# Target to build and run and subsequently remove image
run: build
	docker run --rm \
		-p "localhost:80:3000"
		-v "$(shell pwd)/src:/app/src" \
		homecontroller-gateway

# Target to drop into an interractive shell
shell: build
	docker run --rm \
		-p "localhost:80:3000"
		-v "$(shell pwd)/src:/app/src" \
		-it homecontroller-gateway bash