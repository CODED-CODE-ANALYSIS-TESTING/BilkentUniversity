#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#define SIZE 10
#define COL 4
int readfromFile(FILE* file, int id[SIZE], double point[SIZE][COL])
{
	int i = 0;
	while (fscanf(file, "%d %lf %lf %lf %lf", &id[i], &point[i][0], &point[i][1], &point[i][2], &point[i][3]) != EOF)
	{
		i++;
		fscanf(file, "%d %lf %lf %lf %lf", &id[i], &point[i][0], &point[i][1], &point[i][2], &point[i][3]);
	}
	return(i);
}
void display(int id[], double point[SIZE][COL], int num)
{
	char elig;
	double avg, sum = 0;
	printf("ID  R    L     S     W ELIGIBLE OVERALL\n-----------------------------------------------------------------\n");
	for (int i = 0; i < num; i++)
	{
		sum += point[i][0] + point[i][1] + point[i][2] + point[i][3];
		avg = sum / COL;
		if (avg > 6.5)
			elig = 'Y';
		else
			elig = 'N';
		printf("%3d %2.2f %2.2f %2.2f %2.2f %6c %5.2f\n", id[i], point[i][0], point[i][1], point[i][2], point[i][3], elig, avg);
		sum = 0;
	}
}
int main(void)
{
	FILE* file = fopen("ielts.txt", "r");
	if (file == NULL)
		printf("Couldn't open");
	else
	{
		int num, id[SIZE];
		double point[SIZE][COL];
		num = readfromFile(file, id, point);
		display(id, point, num);
		fclose(file);
		return(0);
	}
}