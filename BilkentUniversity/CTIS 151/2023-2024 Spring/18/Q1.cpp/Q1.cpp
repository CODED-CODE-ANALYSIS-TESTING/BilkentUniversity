#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#define SIZE 4
#define MAX 99


int readFromFile(double grades[][4], int id[], FILE *file)
{
	int i = 0;


	while (fscanf(file, "%d %d %d %d %d", &id[i], &grades[i][1], &grades[i][2], &grades[i][3], &grades[i][4]) != EOF)
	{
		i++;
	};
	return(i);
}

void display(double grades[][4], int id[], int numOfStudents, char ch[], double avg[])
{
	int r, c;
	
	printf("ID \t R \t L \t S \t W \t ELIGIBLE \t OVERALL\n --------------------------------------\n");
	for (r = 0; r < numOfStudents; r++)
		for (c = 0; c < 5; c++)
			printf("%d \t %.2f \t %.2f \t %.2f \t %.2f \t %c \t %.2f", id[r], grades[r][1], grades[r][2], grades[r][3], grades[r][4], ch, avg[r]);
}


int main(void)
{
	FILE * file = fopen("ielts.txt", "r");
	double grades[MAX][SIZE];
	int id[MAX];
	int num;
	double sum[MAX];
	double avg[MAX];
	char ch[MAX];
	if (file == NULL)
		printf("Cannot open");
	else
	{
		int r, c;


		num = readFromFile(grades, id, file);
		for (r = 0; r < num; r++)
		{
			for (c = 1; c < 5; c++)
			{
				sum[r] += grades[r][c];
			}
			avg[r] = sum[r] / 4;
			if (avg[r] > 6.5)
				ch[r] = 'Y';
			else 
				ch[r] = 'N';
		}

		display(grades, id, num, ch, avg);
			
		fclose(file);
	}
	return(0);
}



