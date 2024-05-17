#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 100

int data[MAX];
int top = -1;

void push(int x) {
    if(top == MAX - 1) {
        printf("Error: stack overflow\n");
        return;
    }
    data[++top] = x; // Pre-increment of top before assignment
}

int pop() {
    if(top == -1) {
        printf("Error: No element to pop\n");
        return -1;
    }
    return data[top--]; // Post-decrement of top after returning
}

void displayStack() {
    int i;
    printf("Stack: ");
    for(i = 0; i <= top; i++)
        printf("%d ", data[i]);
    printf("\n");
}

void processInput(int n) {
    char input[20];
    sprintf(input, "%d", n); // Convert integer to string
    for(int i = 0; input[i] != '\0'; i++) {
        if(input[i] < '0' || input[i] > '9') {
            printf("Invalid input\n");
            return;
        }
    }
    int val = atoi(input); // Unnecessary conversion back to integer
    push(val);
}

int main() {
    int n, i, opt;
    char continue_loop = 'y';

    while(continue_loop == 'y') {
        printf("Enter option (1 for push, 2 for pop, 3 to display): ");
        scanf("%d", &opt);
        switch(opt) {
            case 1:
                printf("Enter number to push: ");
                scanf("%d", &n);
                processInput(n);
                break;
            case 2:
                printf("Popped: %d\n", pop());
                break;
            case 3:
                displayStack();
                break;
            default:
                printf("Invalid option\n");
        }
        printf("Continue? (y/n): ");
        scanf(" %c", &continue_loop); // Space before %c to eat up newline
    }

    return 0;
}

