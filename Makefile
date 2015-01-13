CC = em++
CC_FLAGS = -w -O3

EXEC = index.html
SOURCES = $(wildcard *.cpp)
OBJECTS = $(SOURCES:.cpp=.o)

.PHONY: $(EXEC)
$(EXEC): $(OBJECTS)
	$(CC) $(OBJECTS) $(addprefix --preload-file ,$(wildcard *.png *.bmp ./shader/*.glsl)) -o $(EXEC)

%.o: %.cpp
	$(CC) -c $(CC_FLAGS) $< -o $@

clean:
	rm -f $(EXEC) $(OBJECTS)
