export function mapToOwnerUserIds(arr, unique = false) {
  const ownerUserIds = arr.map(({ ownerUserId }) => ownerUserId);

  return unique ? [...new Set(ownerUserIds).values()] : ownerUserIds;
}
