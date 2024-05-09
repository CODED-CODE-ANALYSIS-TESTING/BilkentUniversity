#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#define COL_SIZE 4
#define AVG 6.5

int readFromFile(FILE *file, int id[], double points[][COL_SIZE])
{
	int cntstd = 0;
	int r;
	while (fscanf(file, "%d %lf %lf %lf", &id[cntstd], &points[cntstd][0], &points[cntstd][1], &points[cntstd][2], &points[cntstd][3]));
	{
		cntstd++;
	}

	if (cntstd == 0)
		printf("not valid ");
	return(cntstd);
}


void display(int id[], double points[][COL_SIZE], int cntstd)
{
	int r,c,code;
	double total=0;
	double avg;
	for (r = 0; r < 5; r++)
	{
		for (c = 0; c < COL_SIZE; c++)
		{
			total += points[r][c];
			avg = total / COL_SIZE;
			if (avg < 6.5)
				printf("N\n");
			else
				printf("Y\n");
		}
	}
	


}




int main(void)
{
	
	FILE *file;
	file = fopen(" ielts.txt", "r");

	if (file == NULL)
	{
		printf("can not open the file");
	}

	else
	{
		printf("ID        R       L       S       W       ELIGIBLE       OVERALL");
		printf("-----------------------------------------------------------------");
		scanf("%d         %lf                               %c              %lf",&id[cntstd],&points[][COL_SIZE],&avg)
		int cntstd, id[30];
		double avg, points[30][COL_SIZE];

		readFromFile(file, id, points);
		display(id, points, cntstd);

	}


	return 0;
}