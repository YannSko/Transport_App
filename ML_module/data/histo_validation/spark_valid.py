from pyspark.sql import SparkSession, types
import pyspark.sql.functions as F
import os
import logging

# Setting up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define explicit schemas for different file types
schema_nb_fer = types.StructType([
    types.StructField("JOUR", types.StringType(), True),
    types.StructField("CODE_STIF_TRNS", types.IntegerType(), True),
    types.StructField("CODE_STIF_RES", types.StringType(), True),
    types.StructField("CODE_STIF_ARRET", types.StringType(), True),
    types.StructField("LIBELLE_ARRET", types.StringType(), True),
    types.StructField("ID_REFA_LDA", types.StringType(), True),
    types.StructField("CATEGORIE_TITRE", types.StringType(), True),
    types.StructField("NB_VALD", types.StringType(), True),
    types.StructField("date", types.StringType(), True)
])

schema_profil = types.StructType([
    types.StructField("CODE_STIF_TRNS", types.IntegerType(), True),
    types.StructField("CODE_STIF_RES", types.StringType(), True),
    types.StructField("CODE_STIF_ARRET", types.StringType(), True),
    types.StructField("LIBELLE_ARRET", types.StringType(), True),
    types.StructField("ID_REFA_LDA", types.StringType(), True),
    types.StructField("CAT_JOUR", types.StringType(), True),
    types.StructField("TRNC_HORR_60", types.StringType(), True),
    types.StructField("pourc_validations", types.StringType(), True),
    types.StructField("date", types.StringType(), True)
])

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("VALIDATION MERGE") \
    .config("spark.hadoop.fs.file.impl", "org.apache.hadoop.fs.LocalFileSystem") \
    .config("spark.driver.extraJavaOptions", "-Dhadoop.home.dir=C:/ProgramData/hadoop-3.3.6") \
    .config("spark.executor.extraJavaOptions", "-Dhadoop.home.dir=C:/ProgramData/hadoop-3.3.6") \
    .config("spark.ui.port", "4050") \
    .getOrCreate()

def infer_delimiter(path):
    """Heuristically infer the delimiter of a file by reading the first line."""
    with open(path, 'r', encoding='utf-8') as file:
        first_line = file.readline()
    delimiter = ';' if ';' in first_line else ','
    logging.info(f"Inferred delimiter '{delimiter}' for file: {path}")
    return delimiter

def read_and_label_data(path, file_type, date_pattern):
    """Read data from CSV or TXT, add date column."""
    sep = infer_delimiter(path)  # Dynamically infer the delimiter
    schema = schema_nb_fer if 'NB_FER' in file_type else schema_profil

    # Read the file with the specified delimiter and headers
    df = spark.read.option("header", "true").option("delimiter", sep).schema(schema).csv(path)

    # Check if the column 'lda' exists and rename it to 'ID_REFA_LDA'
    if 'lda' in df.columns:
        df = df.withColumnRenamed('lda', 'ID_REFA_LDA')

    # Debug: Show schema to verify columns are read correctly
    df.printSchema()

    # Extract year from the filename and add as a column
    year = date_pattern.split('_')[0]  # Assuming the year is part of the filename like '2015'
    df = df.withColumn("date", F.lit(year))

    return df

def get_files(directory, pattern):
    """Retrieve files matching the pattern within directories."""
    matched_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if pattern in file:
                matched_files.append((os.path.join(root, file), file))
    logging.info(f"Found {len(matched_files)} files with pattern '{pattern}' in directory: {directory}")
    return matched_files

# Set the base directory to the location of the histo_validation folder
base_dir = r"C:\Users\yskon\Desktop\python_av\Transport_App\ML_module\data\histo_validation"

# Retrieve files matching the patterns for 'NB_FER' and 'PROFIL'
nb_fer_files = get_files(base_dir, "NB_FER")
profil_files = get_files(base_dir, "PROFIL")

# Function to merge dataframes of the same type
def merge_files(files, file_type):
    merged_df = None
    for file_path, file_name in files:
        df = read_and_label_data(file_path, file_type, file_name)
        if merged_df is None:
            merged_df = df
        else:
            merged_df = merged_df.unionByName(df)
    return merged_df

# Merge and save the data for 'NB_FER' and 'PROFIL'
nb_fer_df = merge_files(nb_fer_files, 'NB_FER')
profil_df = merge_files(profil_files, 'PROFIL')

nb_fer_df.write.csv(r"D:\\merged_NB_FER.csv", header=True, mode="overwrite")
profil_df.write.csv(r"D:\\merged_PROFIL.csv", header=True, mode="overwrite")

# Stop the Spark session
spark.stop()
