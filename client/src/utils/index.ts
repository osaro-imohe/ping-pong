import { selectRandomElementInArray } from '../helpers';

const URLS = new Map([['development', 'ws://localhost:8080'], ['production', 'wss://ping-pong-app-server.herokuapp.com']]);

export const BASE_URL = URLS.get(process.env.REACT_APP_ENVIRONMENT ?? 'development');

export const verbs = [
  'accept', 'add', 'admire', 'admit', 'advise', 'afford', 'agree', 'alert', 'allow', 'back', 'bake', 'balance', 'ban', 'bang', 'bare', 'bat', 'bathe', 'battle', 'beam', 'branch', 'breathe', 'bruise', 'brush', 'bubble', 'bump', 'burn', 'bury', 'buzz', 'compare', 'compete', 'complain', 'complete', 'concentrate', 'concern', 'confess', 'confuse', 'connect', 'consider', 'consist', 'contain', 'continue', 'copy', 'correct', 'deliver', 'depend', 'describe', 'desert', 'deserve', 'destroy', 'detect', 'develop', 'disagree', 'disappear', 'increase', 'influence', 'inform', 'inject', 'injure', 'instruct', 'matter', 'measure', 'meddle', 'melt', 'memorise', 'mend', 'messup', 'waste', 'watch', 'water', 'wave', 'weigh', 'welcome', 'whine', 'whip',
];

export const adjectives = [
  'adorable', 'adventurous', 'aggressive', 'agreeable', 'alert', 'alive', 'amused', 'angry', 'annoyed', 'annoying', 'anxious', 'arrogant', 'ashamed', 'attractive', 'average', 'awful', 'bad', 'beautiful', 'better', 'bewildered', 'black', 'bloody', 'blue', 'blue-eyed', 'blushing', 'bored', 'brainy', 'brave', 'breakable', 'bright', 'busy', 'calm', 'careful', 'cautious', 'charming', 'cheerful', 'clean', 'clear', 'clever', 'cloudy', 'clumsy', 'colorful', 'combative', 'comfortable', 'concerned', 'condemned', 'confused', 'cooperative', 'courageous', 'crazy', 'creepy', 'crowded', 'cruel', 'curious', 'cute', 'dangerous', 'dark', 'dead', 'defeated', 'defiant', 'delightful', 'depressed', 'determined', 'different', 'difficult', 'disgusted', 'distinct', 'disturbed', 'dizzy', 'doubtful', 'drab', 'dull', 'lazy', 'light', 'lively', 'lonely', 'long', 'lovely', 'lucky', 'magnificent', 'misty', 'modern', 'motionless', 'muddy', 'vivacious', 'wandering', 'weary', 'wicked', 'wide-eyed', 'wild', 'witty', 'worried', 'worrisome',
];

export const nouns = [
  'people', 'history', 'way', 'art', 'world', 'information', 'map', 'two', 'family', 'government', 'health', 'system', 'computer', 'meat', 'year', 'thanks', 'music', 'person', 'reading', 'method', 'data', 'food', 'understanding', 'theory', 'law', 'bird', 'literature', 'problem', 'software', 'control', 'knowledge', 'power', 'ability', 'economics', 'love', 'internet', 'television', 'science', 'library', 'nature', 'fact', 'product', 'idea', 'temperature', 'investment', 'area', 'society', 'activity', 'story', 'industry', 'media', 'thing', 'oven', 'community', 'definition', 'safety', 'quality', 'development', 'language', 'management', 'player', 'variety', 'video', 'week', 'security', 'country', 'exam', 'movie', 'organization', 'equipment', 'physics', 'analysis', 'policy', 'series', 'thought', 'basis', 'boyfriend', 'direction', 'strategy', 'technology', 'army', 'camera', 'freedom', 'paper', 'environment', 'child', 'instance', 'month', 'truth', 'marketing', 'university', 'writing', 'article', 'department', 'difference', 'goal', 'news', 'audience', 'fishing', 'growth', 'income', 'marriage', 'user', 'combination', 'failure', 'meaning', 'medicine', 'philosophy', 'teacher', 'communication', 'night', 'chemistry', 'disk', 'energy', 'nation',
];

export const generateGameCode = () => {
  const randomVerb = selectRandomElementInArray(verbs);
  const randomAdjective = selectRandomElementInArray(adjectives);
  const randomNoun = selectRandomElementInArray(nouns);
  return `${randomVerb}-${randomAdjective}-${randomNoun}`;
};

export const generateRandomUserId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 50);

// eslint-disable-next-line max-len
export const msg = (user: string, message: any, value: any = {}) => JSON.stringify({ user, message, value });
