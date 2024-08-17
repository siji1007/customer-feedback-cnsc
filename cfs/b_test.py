from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np

def summarizeComments():
    result = ""
    documents = [
        "I love reading about machine learning and artificial intelligence.",
        "The weather today is very sunny and pleasant.",
        "Machine learning models are fascinating and powerful.",
        "Artificial intelligence has many applications in various fields.",
        "I went for a walk in the park and enjoyed the sunshine.",
        "Deep learning is a subset of machine learning.",
        "The technology industry is rapidly evolving.",
        "Sunshine makes me feel very happy and energetic."
    ]

    vectorizer = CountVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(documents)
    lda_model = LatentDirichletAllocation(n_components=min(len(documents), 5), random_state=42)
    lda_model.fit(X)
    feature_names = vectorizer.get_feature_names_out()
    result += "Insights: \n"
    for topic_idx, topic in enumerate(lda_model.components_):
        result += " ".join([feature_names[i] for i in topic.argsort()[:-11:-1]]) + "\n"

    return result

print(summarizeComments())
