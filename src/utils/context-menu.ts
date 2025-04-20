function selectAll(data: number[], list: any[]) {
  for (const i in list) {
    if (list[i].disabled) {
      data[i] = 0;
      continue;
    }
    data[i] = 1;
  }
}

function unselectAll(data: number[], list: any[]) {
  for (const i in list) {
    if (list[i].disabled) {
      data[i] = 0;
      continue;
    }
    data[i] = 0;
  }
}

function invertSelection(data: number[], list: any[]) {
  if (data.length == 0) {
    for (const i in list) {
      if (list[i].disabled) {
        continue;
      }
      data[i] = 1;
    }
    return;
  }
  for (const i in list) {
    if (list[i].disabled) {
      continue;
    }
    if (data[i] == 0) {
      data[i] = 1;
    } else {
      data[i] = 0;
    }
  }
}

function onSelectContextMenu(
  thisData: any,
  e: MouseEvent,
  access: number[],
  accessList: object[]
) {
  e.preventDefault();
  console.log(e);
  //show our menu
  thisData.$contextmenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: thisData.$t("commons.contextMenu.selectAll"),
        onClick: () => {
          selectAll(access, accessList);
        },
      },
      {
        label: thisData.$t("commons.contextMenu.unselectAll"),
        onClick: () => {
          unselectAll(access, accessList);
        },
      },
      {
        label: thisData.$t("commons.contextMenu.invertSelection"),
        onClick: () => {
          invertSelection(access, accessList);
        },
      },
    ],
  });
}

export { onSelectContextMenu };
