#define _CRT_SECURE_NO_WARNINGS

#define ID_ARRAY_SIZE 5
#define ARR_SIZE 4
#include <stdio.h>

int readFromFile(FILE *inpFile, int *id, double points[ARR_SIZE][ARR_SIZE])
{
	int count = 0;
	
	while (fscanf(inpFile, "%d %lf %lf %lf %lf", &id[count], &points[count][0], &points[count][1], &points[count][2], &points[count][3]) != EOF)
	{
		count++;
	}
	count++;
	return count;
}

void display(int *ids, double points[ARR_SIZE][ARR_SIZE], int numOfStudents)
{
	double avg = 0;

	printf("ID\tR\tL\tS\tW\tELIGIBLE\tOVERALL  ");
	printf("\n------------------------------------------------------------------");
	for (int i = 0; i < numOfStudents; i++)
	{
		avg = 0;
		printf("\n%d", ids[i]);
		for (int j = 0; j < ARR_SIZE; j++)
		{
			printf("\t%.2f", points[i][j]);
			avg += points[i][j];
		}
		avg /= ARR_SIZE;

		if (avg >= 6.5)
			printf("\tY");
		else
			printf("\tN");

		printf("\t%.2f", avg);
		printf("\n");
	}
}

int main() 
{
	FILE *inpFile = fopen("ielts.txt", "r");

	int ids[ID_ARRAY_SIZE];
	double points[ID_ARRAY_SIZE][ARR_SIZE];

	int stuCount;

	if (inpFile == NULL) {
		printf("CAN'T OPEN THE SPECIFIED FILE. Closing the program.");
	}
	else {
		stuCount = readFromFile(inpFile, ids, points);
		display(ids , points , stuCount);
	}
	fcloseall();
	return 0;
}