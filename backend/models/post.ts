import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { 
    timestamps: true 
  }
);

export default model<IPost>('Post', postSchema);