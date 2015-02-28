CC = em++
CC_FLAGS = -w -O3

EXEC = index.html
SOURCES = $(wildcard *.cpp)
OBJECTS = $(SOURCES:.cpp=.o)

.PHONY: $(EXEC)
$(EXEC): $(OBJECTS)
	$(CC) $(OBJECTS) -s TOTAL_MEMORY=200000000 $(addprefix --preload-file ,$(wildcard ./models/*.obj ./models/*.mtl ./textures/*.png ./textures/*.jpg ./shader/*.glsl)) -o $(EXEC)

%.o: %.cpp
	$(CC) -c $(CC_FLAGS) $< -o $@

clean:
	rm -f $(EXEC) $(OBJECTS)
