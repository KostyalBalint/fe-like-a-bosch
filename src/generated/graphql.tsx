import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
};

export type Message = {
  __typename: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createMessage: Message;
  removeMessage?: Maybe<Message>;
};


export type MutationCreateMessageArgs = {
  createMessageInput: CreateMessageInput;
};


export type MutationRemoveMessageArgs = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename: 'Query';
  message?: Maybe<Message>;
  messages: Array<Maybe<Message>>;
};


export type QueryMessageArgs = {
  id: Scalars['String']['input'];
};

export type CreateMessageMutationVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type CreateMessageMutation = { __typename: 'Mutation', createMessage: { __typename: 'Message', id: string, createdAt: string } };

export type MessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MessagesQuery = { __typename: 'Query', messages: Array<{ __typename: 'Message', id: string, content: string, createdAt: string } | null> };

export type RemoveMessageMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveMessageMutation = { __typename: 'Mutation', removeMessage?: { __typename: 'Message', id: string, content: string } | null };


export const CreateMessageDocument = gql`
    mutation createMessage($content: String!) {
  createMessage(createMessageInput: {content: $content}) {
    id
    createdAt
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const MessagesDocument = gql`
    query messages {
  messages {
    id
    content
    createdAt
  }
}
    `;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMessagesQuery(baseOptions?: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const RemoveMessageDocument = gql`
    mutation removeMessage($id: String!) {
  removeMessage(id: $id) {
    id
    content
  }
}
    `;
export type RemoveMessageMutationFn = Apollo.MutationFunction<RemoveMessageMutation, RemoveMessageMutationVariables>;

/**
 * __useRemoveMessageMutation__
 *
 * To run a mutation, you first call `useRemoveMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMessageMutation, { data, loading, error }] = useRemoveMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveMessageMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMessageMutation, RemoveMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMessageMutation, RemoveMessageMutationVariables>(RemoveMessageDocument, options);
      }
export type RemoveMessageMutationHookResult = ReturnType<typeof useRemoveMessageMutation>;
export type RemoveMessageMutationResult = Apollo.MutationResult<RemoveMessageMutation>;
export type RemoveMessageMutationOptions = Apollo.BaseMutationOptions<RemoveMessageMutation, RemoveMessageMutationVariables>;