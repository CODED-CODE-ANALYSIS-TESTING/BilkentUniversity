#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#define MAX_STD_NUM 100
#define NUM_OF_EXAMS 4

void readFromFile(FILE *ielts, int id[], double points[][NUM_OF_EXAMS])
{
	int k = 0, l = 0;
	int status;
	char endrow;
	status;
	
	while (scanf(ielts, "%d %lf %lf %lf %lf", &id[k], &points[k][0], &points[k][1], &points[k][2], &points[k][3]) != EOF
	{
	{
		k++;
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


		readFromFile(inp, id, points);

		for (int i = 0; i < 4; i++)
			printf("%d\n", id[i]);

	}




	return 0;
}