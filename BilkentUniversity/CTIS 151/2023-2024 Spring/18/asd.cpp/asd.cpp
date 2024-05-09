#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#define MAX_STD_NUM 100







int main(void)
{
		FILE* inp = fopen("ielts.txt", "r");

		if (inp == NULL)
			printf("ERROR!");
		else
		{
			int k = 0;
			int id[MAX_STD_NUM];
			double points[MAX_STD_NUM][4]; // R L S W

			while (fscanf(inp, "%d \n", &id[k]) != EOF)
			{
				k++;
			}

			
	
		}
	return 0;
}