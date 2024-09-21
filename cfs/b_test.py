from collections import defaultdict
from sentence_transformers import SentenceTransformer, util
import numpy as np

# Sample comments
comments_data = ['Medyo mabagal ang serbisyo', 'Maganda ang Serbisyo', 'Sheeshables', 'Hell Yeah', 'asd', 'malas']

# Load a pre-trained model for sentence embeddings
model = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')

# Function to calculate ratings based on context
def rate_comments(comments_data):
    # Encode comments into embeddings
    embeddings = model.encode(comments_data, convert_to_tensor=True)
    
    # Dictionary to count repetitions
    repetition_count = defaultdict(int)

    # Calculate cosine similarities between comments
    for i in range(len(comments_data)):
        for j in range(i + 1, len(comments_data)):
            similarity = util.pytorch_cos_sim(embeddings[i], embeddings[j])
            if similarity > 0.5:  # Similarity threshold
                repetition_count[comments_data[i]] += 1
                repetition_count[comments_data[j]] += 1

    # Sort comments by their repetition count
    sorted_comments = sorted(repetition_count.items(), key=lambda x: x[1], reverse=True)
    print(sorted_comments)

    return sorted_comments

# Get the rated comments based on context
rated_comments = rate_comments(comments_data)

# Display the results
print("Top Rated Comments by Context:")
for comment, count in rated_comments:
    print(f"Comment: '{comment}' - Contextual Repetitions: {count}")
