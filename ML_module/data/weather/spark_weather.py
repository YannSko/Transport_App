from pyspark.sql import SparkSession
from pyspark.sql.functions import col

import os


# Initialize a SparkSession
spark = SparkSession.builder \
    .appName("Merge and Clean Weather Data") \
    .config("spark.hadoop.fs.file.impl", "org.apache.hadoop.fs.LocalFileSystem") \
    .config("spark.driver.extraJavaOptions", "-Dhadoop.home.dir=C:/ProgramData/hadoop-3.3.6") \
    .config("spark.executor.extraJavaOptions", "-Dhadoop.home.dir=C:/ProgramData/hadoop-3.3.6") \
    .config("spark.ui.port", "4050") \
    .getOrCreate()
spark.sparkContext.setLogLevel("DEBUG") \
# Load the datasets
df1 = spark.read.csv('Q_75_previous-1950-2022_RR-T-Vent.csv', header=True, sep=';', inferSchema=True)
df2 = spark.read.csv('Q_75_previous-1950-2022_autres-parametres.csv', header=True, sep=';', inferSchema=True)

# Alias the DataFrames to avoid column ambiguities
df1_alias = df1.alias('df1')
df2_alias = df2.alias('df2')

# Merge the DataFrames using aliases
merged_df = df1_alias.join(df2_alias, 
                           (df1_alias['NUM_POSTE'] == df2_alias['NUM_POSTE']) &
                           (df1_alias['AAAAMMJJ'] == df2_alias['AAAAMMJJ']),
                           how='outer')

# Assume all columns that exist in both dataframes and drop them from df2 after join
common_columns = [col_name for col_name in df1.columns if col_name in df2.columns]
for col_name in common_columns:
    merged_df = merged_df.drop(df2_alias[col_name])

# Drop columns where all values are null
non_null_columns = [c for c in merged_df.columns if merged_df.filter(col(c).isNull()).count() < merged_df.count()]
merged_df = merged_df.select(*non_null_columns)

# Show the merged DataFrame
print("Merged DataFrame after cleaning:")
merged_df.show(5)

# Optionally, you can save the result to a new CSV
merged_df.write.csv('1950-2022-weather_cleaned.csv', header=True)
