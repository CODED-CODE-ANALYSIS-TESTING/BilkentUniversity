#!/usr/bin/env python
# coding: utf-8

# # Lab 09
# ## Complete the questions below in the space provided.

# Import numpy for use in the program

# Before starting, download the files chicken_weight.csv and chicken_data.csv.  The file chicken_weight.csv is a comma delimited file that stores the weights of a set of chickens and time, which is the time in days since their birth.  The file chicken_data.csv is a comma-delimited file that stores data for the same set of chickens in the same order.  The file chicken_data.csv includes the columns: chick, (an identifier for each chicken) and diet (value between 1 - 4).

# In[25]:


import numpy as np


# Read the data in the comma-delimited file, chicken_weight.csv into a numpy array, weights

# In[26]:


weights = np.loadtxt('chicken_weight.csv', delimiter = ',')
print(weights)


# Read the data in the comma-delimited file, chicken_data.csv into a numpy array, data

# In[27]:


data = np.loadtxt('chicken_data.csv', delimiter = ',', skiprows = 1)
print(data)


# Merge the numpy arrays, weights and data into a two-dimensional numpy array, chicken_data.  The first column should store the weights, and the remaining columns should store the time (in days) from birth, the chicken identifier and the chicken diet (1 - 4).

# In[28]:


chicken_data = np.hstack([weights.T, data])
print(chicken_data)


# Display the mean weight and time for all chickens.

# In[29]:


mean = np.mean(chicken_data[:,0:2], axis = 0)
print(mean)


# Display the data for the chick with the id 38.

# In[30]:


chick_38 = chicken_data[chicken_data[:,2] == 38]
print(chick_38)


# Calculate and display the maximum chicken weight.

# In[31]:


max_weight = np.max(chicken_data[:,0])
print('Maximum Chicken Weight:', max_weight)


# Find and display the age (in days) of the chicken(s) with the maximum weight.

# In[32]:


max_chicken_index= np.argmax(chicken_data[:,0])
print(f'Age of chicken with maximum weight {max_weight} : {chicken_data[max_chicken_index,1]}')


# Extract an array containing the weight, time and id of all chickens with diet 4 and save to a file, diet_four_chickens.csv.

# In[33]:


diet_four = chicken_data[chicken_data[:,3] == 4]
diet_four_data = diet_four[:,0:3]
np.savetxt('diet_four_chickens.csv',diet_four_data, fmt='%.1f', delimiter=',')


# In[ ]:




