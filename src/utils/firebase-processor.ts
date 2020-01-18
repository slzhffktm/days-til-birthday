export function snapshotToArray(snapshot: any) {
    let returnArr: any[] = []

    snapshot.forEach(function(childSnapshot: any) {
        let item = childSnapshot.val()
        item.key = childSnapshot.key

        returnArr.push(item)
    })

    return returnArr
}
