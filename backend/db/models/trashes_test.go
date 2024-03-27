// Code generated by SQLBoiler 3.7.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testTrashes(t *testing.T) {
	t.Parallel()

	query := Trashes()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testTrashesDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testTrashesQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := Trashes().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testTrashesSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := TrashSlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testTrashesExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := TrashExists(ctx, tx, o.ID)
	if err != nil {
		t.Errorf("Unable to check if Trash exists: %s", err)
	}
	if !e {
		t.Errorf("Expected TrashExists to return true, but got false.")
	}
}

func testTrashesFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	trashFound, err := FindTrash(ctx, tx, o.ID)
	if err != nil {
		t.Error(err)
	}

	if trashFound == nil {
		t.Error("want a record, got nil")
	}
}

func testTrashesBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = Trashes().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testTrashesOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := Trashes().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testTrashesAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	trashOne := &Trash{}
	trashTwo := &Trash{}
	if err = randomize.Struct(seed, trashOne, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}
	if err = randomize.Struct(seed, trashTwo, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = trashOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = trashTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Trashes().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testTrashesCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	trashOne := &Trash{}
	trashTwo := &Trash{}
	if err = randomize.Struct(seed, trashOne, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}
	if err = randomize.Struct(seed, trashTwo, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = trashOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = trashTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func trashBeforeInsertHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashAfterInsertHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashAfterSelectHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashBeforeUpdateHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashAfterUpdateHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashBeforeDeleteHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashAfterDeleteHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashBeforeUpsertHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func trashAfterUpsertHook(ctx context.Context, e boil.ContextExecutor, o *Trash) error {
	*o = Trash{}
	return nil
}

func testTrashesHooks(t *testing.T) {
	t.Parallel()

	var err error

	ctx := context.Background()
	empty := &Trash{}
	o := &Trash{}

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, o, trashDBTypes, false); err != nil {
		t.Errorf("Unable to randomize Trash object: %s", err)
	}

	AddTrashHook(boil.BeforeInsertHook, trashBeforeInsertHook)
	if err = o.doBeforeInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeInsertHook function to empty object, but got: %#v", o)
	}
	trashBeforeInsertHooks = []TrashHook{}

	AddTrashHook(boil.AfterInsertHook, trashAfterInsertHook)
	if err = o.doAfterInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterInsertHook function to empty object, but got: %#v", o)
	}
	trashAfterInsertHooks = []TrashHook{}

	AddTrashHook(boil.AfterSelectHook, trashAfterSelectHook)
	if err = o.doAfterSelectHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterSelectHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterSelectHook function to empty object, but got: %#v", o)
	}
	trashAfterSelectHooks = []TrashHook{}

	AddTrashHook(boil.BeforeUpdateHook, trashBeforeUpdateHook)
	if err = o.doBeforeUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpdateHook function to empty object, but got: %#v", o)
	}
	trashBeforeUpdateHooks = []TrashHook{}

	AddTrashHook(boil.AfterUpdateHook, trashAfterUpdateHook)
	if err = o.doAfterUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpdateHook function to empty object, but got: %#v", o)
	}
	trashAfterUpdateHooks = []TrashHook{}

	AddTrashHook(boil.BeforeDeleteHook, trashBeforeDeleteHook)
	if err = o.doBeforeDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeDeleteHook function to empty object, but got: %#v", o)
	}
	trashBeforeDeleteHooks = []TrashHook{}

	AddTrashHook(boil.AfterDeleteHook, trashAfterDeleteHook)
	if err = o.doAfterDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterDeleteHook function to empty object, but got: %#v", o)
	}
	trashAfterDeleteHooks = []TrashHook{}

	AddTrashHook(boil.BeforeUpsertHook, trashBeforeUpsertHook)
	if err = o.doBeforeUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpsertHook function to empty object, but got: %#v", o)
	}
	trashBeforeUpsertHooks = []TrashHook{}

	AddTrashHook(boil.AfterUpsertHook, trashAfterUpsertHook)
	if err = o.doAfterUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpsertHook function to empty object, but got: %#v", o)
	}
	trashAfterUpsertHooks = []TrashHook{}
}

func testTrashesInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testTrashesInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(trashColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testTrashToOneDirUsingDir(t *testing.T) {
	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var local Trash
	var foreign Dir

	seed := randomize.NewSeed()
	if err := randomize.Struct(seed, &local, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}
	if err := randomize.Struct(seed, &foreign, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	if err := foreign.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	queries.Assign(&local.DirID, foreign.ID)
	if err := local.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	check, err := local.Dir().One(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}

	if !queries.Equal(check.ID, foreign.ID) {
		t.Errorf("want: %v, got %v", foreign.ID, check.ID)
	}

	slice := TrashSlice{&local}
	if err = local.L.LoadDir(ctx, tx, false, (*[]*Trash)(&slice), nil); err != nil {
		t.Fatal(err)
	}
	if local.R.Dir == nil {
		t.Error("struct should have been eager loaded")
	}

	local.R.Dir = nil
	if err = local.L.LoadDir(ctx, tx, true, &local, nil); err != nil {
		t.Fatal(err)
	}
	if local.R.Dir == nil {
		t.Error("struct should have been eager loaded")
	}
}

func testTrashToOneFileUsingFile(t *testing.T) {
	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var local Trash
	var foreign File

	seed := randomize.NewSeed()
	if err := randomize.Struct(seed, &local, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}
	if err := randomize.Struct(seed, &foreign, fileDBTypes, false, fileColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize File struct: %s", err)
	}

	if err := foreign.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	queries.Assign(&local.FileID, foreign.ID)
	if err := local.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	check, err := local.File().One(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}

	if !queries.Equal(check.ID, foreign.ID) {
		t.Errorf("want: %v, got %v", foreign.ID, check.ID)
	}

	slice := TrashSlice{&local}
	if err = local.L.LoadFile(ctx, tx, false, (*[]*Trash)(&slice), nil); err != nil {
		t.Fatal(err)
	}
	if local.R.File == nil {
		t.Error("struct should have been eager loaded")
	}

	local.R.File = nil
	if err = local.L.LoadFile(ctx, tx, true, &local, nil); err != nil {
		t.Fatal(err)
	}
	if local.R.File == nil {
		t.Error("struct should have been eager loaded")
	}
}

func testTrashToOneSetOpDirUsingDir(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Trash
	var b, c Dir

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &b, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &c, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	for i, x := range []*Dir{&b, &c} {
		err = a.SetDir(ctx, tx, i != 0, x)
		if err != nil {
			t.Fatal(err)
		}

		if a.R.Dir != x {
			t.Error("relationship struct not set to correct value")
		}

		if x.R.Trashes[0] != &a {
			t.Error("failed to append to foreign relationship struct")
		}
		if !queries.Equal(a.DirID, x.ID) {
			t.Error("foreign key was wrong value", a.DirID)
		}

		zero := reflect.Zero(reflect.TypeOf(a.DirID))
		reflect.Indirect(reflect.ValueOf(&a.DirID)).Set(zero)

		if err = a.Reload(ctx, tx); err != nil {
			t.Fatal("failed to reload", err)
		}

		if !queries.Equal(a.DirID, x.ID) {
			t.Error("foreign key was wrong value", a.DirID, x.ID)
		}
	}
}

func testTrashToOneRemoveOpDirUsingDir(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Trash
	var b Dir

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &b, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}

	if err = a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	if err = a.SetDir(ctx, tx, true, &b); err != nil {
		t.Fatal(err)
	}

	if err = a.RemoveDir(ctx, tx, &b); err != nil {
		t.Error("failed to remove relationship")
	}

	count, err := a.Dir().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 0 {
		t.Error("want no relationships remaining")
	}

	if a.R.Dir != nil {
		t.Error("R struct entry should be nil")
	}

	if !queries.IsValuerNil(a.DirID) {
		t.Error("foreign key value should be nil")
	}

	if len(b.R.Trashes) != 0 {
		t.Error("failed to remove a from b's relationships")
	}
}

func testTrashToOneSetOpFileUsingFile(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Trash
	var b, c File

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &b, fileDBTypes, false, strmangle.SetComplement(filePrimaryKeyColumns, fileColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &c, fileDBTypes, false, strmangle.SetComplement(filePrimaryKeyColumns, fileColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	for i, x := range []*File{&b, &c} {
		err = a.SetFile(ctx, tx, i != 0, x)
		if err != nil {
			t.Fatal(err)
		}

		if a.R.File != x {
			t.Error("relationship struct not set to correct value")
		}

		if x.R.Trashes[0] != &a {
			t.Error("failed to append to foreign relationship struct")
		}
		if !queries.Equal(a.FileID, x.ID) {
			t.Error("foreign key was wrong value", a.FileID)
		}

		zero := reflect.Zero(reflect.TypeOf(a.FileID))
		reflect.Indirect(reflect.ValueOf(&a.FileID)).Set(zero)

		if err = a.Reload(ctx, tx); err != nil {
			t.Fatal("failed to reload", err)
		}

		if !queries.Equal(a.FileID, x.ID) {
			t.Error("foreign key was wrong value", a.FileID, x.ID)
		}
	}
}

func testTrashToOneRemoveOpFileUsingFile(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Trash
	var b File

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &b, fileDBTypes, false, strmangle.SetComplement(filePrimaryKeyColumns, fileColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}

	if err = a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	if err = a.SetFile(ctx, tx, true, &b); err != nil {
		t.Fatal(err)
	}

	if err = a.RemoveFile(ctx, tx, &b); err != nil {
		t.Error("failed to remove relationship")
	}

	count, err := a.File().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 0 {
		t.Error("want no relationships remaining")
	}

	if a.R.File != nil {
		t.Error("R struct entry should be nil")
	}

	if !queries.IsValuerNil(a.FileID) {
		t.Error("foreign key value should be nil")
	}

	if len(b.R.Trashes) != 0 {
		t.Error("failed to remove a from b's relationships")
	}
}

func testTrashesReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testTrashesReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := TrashSlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testTrashesSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Trashes().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	trashDBTypes = map[string]string{`ID`: `uuid`, `DirID`: `uuid`, `FileID`: `uuid`, `IsDelete`: `boolean`, `CreatedAt`: `timestamp without time zone`}
	_            = bytes.MinRead
)

func testTrashesUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(trashPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(trashAllColumns) == len(trashPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, trashDBTypes, true, trashPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testTrashesSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(trashAllColumns) == len(trashPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Trash{}
	if err = randomize.Struct(seed, o, trashDBTypes, true, trashColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, trashDBTypes, true, trashPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(trashAllColumns, trashPrimaryKeyColumns) {
		fields = trashAllColumns
	} else {
		fields = strmangle.SetComplement(
			trashAllColumns,
			trashPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := TrashSlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testTrashesUpsert(t *testing.T) {
	t.Parallel()

	if len(trashAllColumns) == len(trashPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := Trash{}
	if err = randomize.Struct(seed, &o, trashDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, false, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Trash: %s", err)
	}

	count, err := Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, trashDBTypes, false, trashPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Trash struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, true, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Trash: %s", err)
	}

	count, err = Trashes().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}