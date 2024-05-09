#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int summation(int num1, int num2) {
	int total=0;
	for (int i = 1; i <= num1; i++) {
		total += num2;
	}
	return total;
}

int subtraction(int num1, int num2) {
	while (num2 >= num1) {
		num2 -= num1;
	}
	return num2;
}

int main(void) {
	int num1, num2,total;	

	do {
		printf("Enter the num1 and num2: ");
		scanf(" %d %d", &num1, &num2);
		
		if (num1 > num2) {
			total=summation(num1, num2);
			printf("%d > %d => Result of Operation: %d\n", num1, num2, total);
		}
		else if (num1 < num2) {
			total=subtraction(num1, num2);
			printf("%d < %d => Result of Operation: %d\n", num1, num2, total);
		}
		else {
			printf("Goodbyee :D");
			break;
		}

	} while (num1 != num2);

	return 0;
}