CC = em++
CC_FLAGS = -w

EXEC = index.html
SOURCES = $(wildcard *.cpp)
OBJECTS = $(SOURCES:.cpp=.o)

$(EXEC): $(OBJECTS)
	$(CC) $(OBJECTS) $(addprefix --preload-file ,$(wildcard *.png *.bmp ./shader/*.glsl)) -o $(EXEC)

%.o: %.cpp
	$(CC) -c $(CC_FLAGS) $< -o $@

clean:
	rm -f $(EXEC) $(OBJECTS)
