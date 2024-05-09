#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#define MAX_STD_NUM 100
#define NUM_OF_EXAMS 4

int readFromFile(FILE *ielts, int id[], double points[][NUM_OF_EXAMS])
{
	int numStd = 0;
	
	while(fscanf(ielts, "%d %lf %lf %lf %lf", &id[numStd], &points[numStd][0], &points[numStd][1], &points[numStd][2], &points[numStd][3]) != EOF)
	{
		numStd++;
	}
	return numStd;
}
void display(int id[], double points[][NUM_OF_EXAMS], int numStd) 

{
	int iseligible;
	double overall;
	double sum[NUM_OF_EXAMS] = {0.0};
	double avg[NUM_OF_EXAMS];
	printf("ID   R    L    S    W		ELIGIBLE   OVERALL\n");
	printf("-----------------------------------------------------------------\n");
	
	for (int i = 0; i < numStd; i++)
	{
		printf("%-4d ", id[i]);
		for (int j = 0; j < NUM_OF_EXAMS; j++)
		{
			printf("%0.2f ", points[i][j]);
			sum[i] += points[i][j];
		
		}
		avg[i] = sum[i] / NUM_OF_EXAMS;
		printf("                   %0.2f", avg[i]);
		printf("\n");
	}

}




int main(void)
{
	FILE* inp = fopen("ielts.txt", "r");

	if (inp == NULL)
		printf("ERROR!");

	else
	{
		int id[MAX_STD_NUM];
		double points[MAX_STD_NUM][NUM_OF_EXAMS];
		int numStd;
		numStd = readFromFile(inp, id, points);
		
		display(id, points, numStd);
		
		

	}




	return 0;
}