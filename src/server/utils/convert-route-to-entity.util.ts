const mapping: Record<string, string> = {
  comments: 'comment',
  contents: 'content',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
