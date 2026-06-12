import axios from 'axios';
import type { User, InternshipApplication } from '../types';


const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper to simulate network latency or arbitrary errors (for demonstration)
export const simulateNetworkLatency = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export interface DummyJobResponse {
  id: number;
  title: string;
  body: string;
  reactions: { likes: number; dislikes: number } | number;
  tags: string[];
}

export interface JobRecommendation {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  description: string;
  tags: string[];
}

export const apiService = {
  /**
   * Fetches a dummy profile from dummyjson
   */
  getStudentProfile: async (userId: number = 1): Promise<User> => {
    try {
      const response = await api.get(`/users/${userId}`);
      const data = response.data;
      return {
        id: String(data.id),
        email: data.email || 'student@example.com',
        name: `${data.firstName} ${data.lastName}`,
        avatarUrl: data.image || 'https://robohash.org/student.png?size=150x150',
        targetIndustries: ['Software Engineering', 'Product Management', 'Data Science'],
        preferences: {
          locationPreference: 'remote',
          jobTypePreference: 'internship',
        }
      };
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw new Error('Failed to retrieve student profile. Please check your internet connection and try again.');
    }
  },

  /**
   * Fetches dummy posts and translates them into mock job recommendations
   */
  getJobRecommendations: async (): Promise<JobRecommendation[]> => {
    try {
      const response = await api.get('/posts?limit=15');
      const posts: DummyJobResponse[] = response.data.posts;
      
      const companies = [
        'Google', 'Meta', 'Microsoft', 'Apple', 'Netflix', 
        'Stripe', 'Airbnb', 'Uber', 'Amazon', 'Slack', 
        'Figma', 'Vercel', 'Canva', 'Notion', 'Coinbase'
      ];
      const locations = [
        'San Francisco, CA', 'New York, NY', 'Seattle, WA', 
        'Austin, TX', 'Remote', 'Remote', 'London, UK', 
        'Dublin, IE', 'Boston, MA', 'Toronto, ON'
      ];

      return posts.map((post, index) => {
        const company = companies[index % companies.length];
        const location = locations[index % locations.length];
        return {
          id: `rec-${post.id}`,
          companyName: company,
          jobTitle: post.title.split(' ').slice(0, 3).join(' ') + ' Intern',
          location: location,
          description: post.body,
          tags: post.tags,
        };
      });
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw new Error('Failed to fetch job recommendations from dummyjson API. Please retry.');
    }
  },

  /**
   * Simulates posting a new internship application to dummyjson
   */
  createInternshipApplication: async (application: Omit<InternshipApplication, 'id'>): Promise<InternshipApplication> => {
    try {
      // DummyJSON supports post to /posts/add
      const response = await api.post('/posts/add', {
        title: `${application.jobTitle} at ${application.companyName}`,
        userId: 1,
        body: application.notes,
      });

      await simulateNetworkLatency(1000);

      // Return application back with generated ID
      return {
        ...application,
        id: `app-${response.data.id || Date.now()}`,
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error('API submission failed. Please verify connection and retry.');
    }
  }
};
